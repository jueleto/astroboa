/*
 * Copyright (C) 2005-2011 BetaCONCEPT LP.
 *
 * This file is part of Astroboa.
 *
 * Astroboa is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Astroboa is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with Astroboa.  If not, see <http://www.gnu.org/licenses/>.
 */

package org.betaconceptframework.astroboa.api.service.secure;



import java.util.List;

import org.betaconceptframework.astroboa.api.model.LocalizableEntity;
import org.betaconceptframework.astroboa.api.model.Taxonomy;
import org.betaconceptframework.astroboa.api.model.Topic;
import org.betaconceptframework.astroboa.api.model.definition.Localization;
import org.betaconceptframework.astroboa.api.model.io.FetchLevel;
import org.betaconceptframework.astroboa.api.model.io.ResourceRepresentationType;
import org.betaconceptframework.astroboa.api.model.query.CmsOutcome;
import org.betaconceptframework.astroboa.api.model.query.criteria.CmsQueryContext;
import org.betaconceptframework.astroboa.api.model.query.criteria.TopicCriteria;
import org.betaconceptframework.astroboa.api.security.AstroboaCredentials;
import org.betaconceptframework.astroboa.api.security.CmsRole;
import org.betaconceptframework.astroboa.api.service.TopicService;

/**
 * Secure Topic Service API. 
 * 
 * <p>
 * It contains methods provided by 
 * {@link TopicService} with the addition that each method requires
 * an authentication token as an extra parameter, in order to ensure
 * that client has been successfully logged in an Astroboa repository and
 * therefore has been granted access to further use Astroboa services
 * </p>
 * 
 * 
 * @author Gregory Chomatas (gchomatas@betaconcept.com)
 * @author Savvas Triantafyllou (striantafyllou@betaconcept.com)
 * 
 */
public interface TopicServiceSecure {
	/**
	 * Same semantics with {@link TopicService#saveTopic(Topic)}
	 * augmented with the requirement of providing an authentication token.
	 *
	 *<p>
	 * This method is executed only if user has role
	 * {@link CmsRole#ROLE_CMS_TAXONOMY_EDITOR} upon connected Astroboa repository.
	 * Information about user's roles is available through provided authentication 
	 * token.
	 *</p>
	 *
	 * @param topic
	 *            Topic to be saved or updated.
	 * @param authenticationToken A token provided during client login ({@link RepositoryServiceSecure#login(String, AstroboaCredentials, String)}) 
	 *  to an Astroboa repository.
	 * @deprecated Use method {@link #save(Object,String)} instead
	 * @return Newly created or updated Topic
	 */
	@Deprecated
	Topic saveTopic(Topic topic, String authenticationToken);

	/**
	 * Same semantics with {@link TopicService#deleteTopicTree(String)}
	 * augmented with the requirement of providing an authentication token.
	 *
	 *<p>
	 * This method is executed only if user has role
	 * {@link CmsRole#ROLE_CMS_TAXONOMY_EDITOR} upon connected Astroboa repository.
	 * Information about user's roles is available through provided authentication 
	 * token.
	 *</p>
	 *
	 * @param topicId
	 *            {@link Topic#getId() Topic's id}.
	 * @param authenticationToken A token provided during client login ({@link RepositoryServiceSecure#login(String, AstroboaCredentials, String)}) 
	 *  to an Astroboa repository.
	 */
	void deleteTopicTree(String topicId, String authenticationToken);

	/**
	 * Same semantics with {@link TopicService#getTopic(String, String)}
	 * augmented with the requirement of providing an authentication token.
	 *
	 *<p>
	 * This method is executed only if user has role
	 * {@link CmsRole#ROLE_CMS_EXTERNAL_VIEWER} upon connected Astroboa repository.
	 * Information about user's roles is available through provided authentication 
	 * token.
	 *</p>
	 *
	 * @param topicId
	 *            {@link Topic#getId() Topic's id}.
	 * @param locale
	 *            Locale value as defined in {@link Localization} to be
	 *            used when user calls method {@link LocalizableEntity#getLocalizedLabelForCurrentLocale()}
	 *            to retrieve localized label for returned topic.
	 * @param authenticationToken A token provided during client login ({@link RepositoryServiceSecure#login(String, AstroboaCredentials, String)}) 
	 *  to an Astroboa repository.
	 * 
	 * @deprecated Use {@link #getTopic(String, ResourceRepresentationType, FetchLevel)} instead
	 * @return A topic corresponding to <code>topicId</code> 
	 */
	@Deprecated
	Topic getTopic(String topicId, String locale, String authenticationToken);

	/**
	 * Same semantics with {@link TopicService#searchTopics(TopicCriteria)}
	 * augmented with the requirement of providing an authentication token.
	 *
	 *<p>
	 * This method is executed only if user has role
	 * {@link CmsRole#ROLE_CMS_EXTERNAL_VIEWER} upon connected Astroboa repository.
	 * Information about user's roles is available through provided authentication 
	 * token.
	 *</p>
	 *
	 * @param topicCriteria
	 *            Topic search criteria.
	 * @param authenticationToken A token provided during client login ({@link RepositoryServiceSecure#login(String, AstroboaCredentials, String)}) 
	 *  to an Astroboa repository.
	 * 
	 * @deprecated Use {@link #searchTopics(TopicCriteria, ResourceRepresentationType, String)}
	 * @return Topics satisfying specified criteria.
	 */
	@Deprecated
	CmsOutcome<Topic> searchTopics(TopicCriteria topicCriteria, String authenticationToken);

	/**
	 * Same semantics with {@link TopicService#getMostlyUsedTopics(String, String, int, int)}
	 * augmented with the requirement of providing an authentication token.
	 *
	 *<p>
	 * This method is executed only if user has role
	 * {@link CmsRole#ROLE_CMS_EXTERNAL_VIEWER} upon connected Astroboa repository.
	 * Information about user's roles is available through provided authentication 
	 * token.
	 *</p>
	 *
	 * @param taxonomyName
	 *            {@link Taxonomy#getName() Taxonomy name}.
	 * @param locale
	 *            Locale value as defined in {@link Localization} to be
	 *            used when user calls method {@link LocalizableEntity#getLocalizedLabelForCurrentLocale()}
	 *            to retrieve localized label for returned topics.
	 * @param offset
	 *            Index of first result row
	 *            {@link CmsQueryContext#setOffset}
	 * @param limit
	 *            Index of last result row
	 *            {@link CmsQueryContext#setLimit}
	 * @param authenticationToken A token provided during client login ({@link RepositoryServiceSecure#login(String, AstroboaCredentials, String)}) 
	 *  to an Astroboa repository.
	 * 
	 * @return Mostly used topics of a specific taxonomy.
	 */
	CmsOutcome<Topic> getMostlyUsedTopics(String taxonomyName, String locale,
			int offset, int limit, String authenticationToken);

	/**
	 * Same semantics with {@link TopicService#getContentObjectIdsWhichReferToTopic(String)}
	 * augmented with the requirement of providing an authentication token.
	 *
	 *<p>
	 * This method is executed only if user has role
	 * {@link CmsRole#ROLE_CMS_EXTERNAL_VIEWER} upon connected Astroboa repository.
	 * Information about user's roles is available through provided authentication 
	 * token.
	 *</p>
	 *
	 * @param topicId Topic identifier
	 * @param authenticationToken A token provided during client login ({@link RepositoryServiceSecure#login(String, AstroboaCredentials, String)}) 
	 *  to an Astroboa repository.
	 * 
	 * @return A list of content object identifiers
	 */
	List<String> getContentObjectIdsWhichReferToTopic(String topicId, String authenticationToken);

	/**
	 * Same semantics with {@link TopicService#getCountOfContentObjectIdsWhichReferToTopic(String)}
	 * augmented with the requirement of providing an authentication token.
	 * 
	 *<p>
	 * This method is executed only if user has role
	 * {@link CmsRole#ROLE_CMS_EXTERNAL_VIEWER} upon connected Astroboa repository.
	 * Information about user's roles is available through provided authentication 
	 * token.
	 *</p>
	 *
	 * @param topicId Topic identifier
	 * @param authenticationToken A token provided during client login ({@link RepositoryServiceSecure#login(String, AstroboaCredentials, String)}) 
	 *  to an Astroboa repository.
	 * 
	 * @return Number of content objects which refer to topic.
	 */
	int getCountOfContentObjectIdsWhichReferToTopic(String topicId, String authenticationToken);

	/**
	 * Same semantics with {@link TopicService#getTopic(String, ResourceRepresentationType, FetchLevel)}
	 * augmented with the requirement of providing an authentication token.
	 * 
	 *<p>
	 * This method is executed only if user has role
	 * {@link CmsRole#ROLE_CMS_EXTERNAL_VIEWER} upon connected Astroboa repository.
	 * Information about user's roles is available through provided authentication 
	 * token.
	 *</p>
	 * 
	 * @param <T> {@link String}, {@link Topic} or {@link CmsOutcome}
	 * @param topicIdOrName {@link Topic#getId() topic id} or {@link Topic#getName() topic name}
	 * @param output Topic representation output, one of XML, JSON or {@link Topic}. Default is {@link ResourceRepresentationType#TOPIC_INSTANCE}
	 * @param fetchLevel Specify whether to load {@link Topic}'s only properties, its children as well or the whole {@link Topic} tree.
	 * Default is {@link FetchLevel#ENTITY}
	 * @param authenticationToken A token provided during client login ({@link RepositoryServiceSecure#login(String, AstroboaCredentials, String)}) 
	 *  to an Astroboa repository.
	 * 
	 * @return A topic as XML, JSON or {@link Topic}, or <code>null</code> of none is found.
	 */
	<T> T getTopic(String topicIdOrName, ResourceRepresentationType<T> output, FetchLevel fetchLevel, String authenticationToken);
	
	/**
	 * Same semantics with {@link TopicService#save(Object)}
	 * augmented with the requirement of providing an authentication token.
	 *
	 *<p>
	 * This method is executed only if user has role
	 * {@link CmsRole#ROLE_CMS_TAXONOMY_EDITOR} upon connected Astroboa repository.
	 * Information about user's roles is available through provided authentication 
	 * token.
	 *</p>
	 *
	 * @param topic
	 *            Topic to be saved or updated.
	 * @param authenticationToken A token provided during client login ({@link RepositoryServiceSecure#login(String, AstroboaCredentials, String)}) 
	 *  to an Astroboa repository.
	 * 
	 * @return Newly created or updated Topic
	 */
	Topic save(Object topic, String authenticationToken);
	
	/**
	 * Same semantics with {@link TopicService#searchTopics(TopicCriteria, ResourceRepresentationType)}
	 * augmented with the requirement of providing an authentication token.
	 * 
 	 *<p>
	 * This method is executed only if user has role
	 * {@link CmsRole#ROLE_CMS_EXTERNAL_VIEWER} upon connected Astroboa repository.
	 * Information about user's roles is available through provided authentication 
	 * token.
	 *</p>
	 * 
	 * @param <T> {@link String}, {@link Topic} or {@link CmsOutcome}
	 * @param topicCriteria
	 *            Restrictions for content object and render instructions for
	 *            query results.
	 * @param output Topic representation output, one of XML, JSON or {@link Topic}. 
	 * 	Default is {@link ResourceRepresentationType#TOPIC_LIST}
	 * @param authenticationToken A token provided during client login ({@link RepositoryServiceSecure#login(String, AstroboaCredentials, String)}) to an Astroboa repository.
	 *
	 * @return Topics as XML, JSON or {@link CmsOutcome<Topic>}	 
	 */
	<T> T  searchTopics(TopicCriteria topicCriteria, ResourceRepresentationType<T> output, String authenticationToken);

	/**
	 * Same semantics with {@link TopicService#searchTopicsAndExportToXml(TopicCriteria)}
	 * augmented with the requirement of providing an authentication token.
	 *
	 *<p>
	 * This method is executed only if user has role
	 * {@link CmsRole#ROLE_CMS_EXTERNAL_VIEWER} upon connected Astroboa repository.
	 * Information about user's roles is available through provided authentication 
	 * token.
	 *</p>
	 * 
	 * @param topicCriteria
	 *            Restrictions for topic and render instructions for
	 *            query results.
	 * @param authenticationToken A token provided during client login ({@link RepositoryServiceSecure#login(String, AstroboaCredentials, String)}) 
	 *  to an Astroboa repository.
	 *  
	 * @deprecated Use {@link #searchTopics(TopicCriteria, ResourceRepresentationType, String)} instead
	 * 
	 * @return XML representation of query results following XML element <code>resourceRepresentation</code>
	 *   defined in astroboa-api-{version}.xsd
	 */
	@Deprecated
	String searchTopicsAndExportToXml(TopicCriteria topicCriteria, String authenticationToken);
	

	/**
	 * Same semantics with {@link TopicService#searchTopicsAndExportToJson(TopicCriteria)}
	 * augmented with the requirement of providing an authentication token.
	 *
	 *<p>
	 * This method is executed only if user has role
	 * {@link CmsRole#ROLE_CMS_EXTERNAL_VIEWER} upon connected Astroboa repository.
	 * Information about user's roles is available through provided authentication 
	 * token.
	 *</p>
     * 
	 * @param topicCriteria
	 *            Restrictions for topic and render instructions for
	 *            query results.
	 * @param authenticationToken A token provided during client login ({@link RepositoryServiceSecure#login(String, AstroboaCredentials, String)}) 
	 *  to an Astroboa repository.
	 *  
	 * @deprecated Use {@link #searchTopics(TopicCriteria, ResourceRepresentationType, String)} instead
	 * 
	 * @return JSON representation of query results according to XML element <code>resourceRepresentation</code>
	 *   defined in astroboa-api-{version}.xsd  following Mapped convention
	 */
	@Deprecated
	String searchTopicsAndExportToJson(TopicCriteria topicCriteria, String authenticationToken);

}
